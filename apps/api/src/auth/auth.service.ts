import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService, type JwtSignOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { AccountStatus, ClinicProfileStatus, LocumProfileStatus, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import { LoginDto } from "./dto/login.dto";
import { RegisterLocumDto } from "./dto/register-locum.dto";
import { RegisterClinicDto } from "./dto/register-clinic.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerLocum(dto: RegisterLocumDto) {
    if (!dto.acceptedPrivacyNotice || !dto.acceptedSensitiveDataUse) {
      throw new BadRequestException("Privacy notice and sensitive data consent are required.");
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException("Email already in use.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: UserRole.LOCUM,
        accountStatus: AccountStatus.PENDING_VERIFICATION,
        acceptedPrivacyNotice: dto.acceptedPrivacyNotice,
        acceptedSensitiveDataUse: dto.acceptedSensitiveDataUse,
        marketingOptIn: dto.marketingOptIn ?? false,
        privacyConsentVersion: "cdpa-si155-2026-04",
        privacyConsentedAt: new Date(),
        locumProfile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            professionId: dto.professionId,
            status: LocumProfileStatus.DRAFT,
            languages: [],
          },
        },
      },
    });

    return { id: user.id, email: user.email, role: user.role, accountStatus: user.accountStatus };
  }

  async registerClinic(dto: RegisterClinicDto) {
    if (!dto.acceptedPrivacyNotice || !dto.acceptedSensitiveDataUse) {
      throw new BadRequestException("Privacy notice and data processing consent are required.");
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException("Email already in use.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: UserRole.CLINIC,
        accountStatus: AccountStatus.PENDING_VERIFICATION,
        acceptedPrivacyNotice: dto.acceptedPrivacyNotice,
        acceptedSensitiveDataUse: dto.acceptedSensitiveDataUse,
        marketingOptIn: dto.marketingOptIn ?? false,
        privacyConsentVersion: "cdpa-si155-2026-04",
        privacyConsentedAt: new Date(),
        clinicProfile: {
          create: {
            facilityName: dto.facilityName,
            status: ClinicProfileStatus.DRAFT,
            departments: [],
          },
        },
      },
    });

    return { id: user.id, email: user.email, role: user.role, accountStatus: user.accountStatus };
  }

  async login(dto: LoginDto, userAgent?: string, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const matches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const tokens = await this.createTokens(user.id, user.email, user.role, user.accountStatus);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.prisma.refreshSession.create({
      data: {
        userId: user.id,
        tokenHash: this.sha256(tokens.refreshToken),
        expiresAt: tokens.refreshExpiresAt,
        userAgent,
        ipAddress,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    };
  }

  async refresh(dto: RefreshDto) {
    const tokenHash = this.sha256(dto.refreshToken);
    const session = await this.prisma.refreshSession.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedException("Invalid refresh token.");
    }

    const tokens = await this.createTokens(
      session.user.id,
      session.user.email,
      session.user.role,
      session.user.accountStatus,
    );

    await this.prisma.refreshSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    await this.prisma.refreshSession.create({
      data: {
        userId: session.userId,
        tokenHash: this.sha256(tokens.refreshToken),
        expiresAt: tokens.refreshExpiresAt,
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    };
  }

  async logout(refreshToken: string) {
    const tokenHash = this.sha256(refreshToken);
    await this.prisma.refreshSession.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { success: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      return { success: true };
    }

    const rawToken = randomBytes(32).toString("hex");
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: this.sha256(rawToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      },
    });

    return { success: true, resetTokenDevOnly: rawToken };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const token = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash: this.sha256(dto.token),
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!token) {
      throw new NotFoundException("Reset token not found or expired.");
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: token.userId },
        data: { passwordHash: await bcrypt.hash(dto.newPassword, 12) },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshSession.updateMany({
        where: { userId: token.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { success: true };
  }

  private async createTokens(userId: string, email: string, role: UserRole, accountStatus: AccountStatus) {
    const payload = { sub: userId, email, role, accountStatus };
    const accessExpiresIn = this.configService.get<string>("JWT_ACCESS_EXPIRES_IN") ?? "15m";
    const refreshExpiryDays = this.configService.get<number>("JWT_REFRESH_DAYS", 30);

    const signOptions: JwtSignOptions = {
      secret: this.configService.get<string>("JWT_ACCESS_SECRET") ?? "dev-access-secret",
      expiresIn: accessExpiresIn as JwtSignOptions["expiresIn"],
    };

    const accessToken = await this.jwtService.signAsync(payload, signOptions);
    const refreshToken = randomBytes(48).toString("hex");
    const refreshExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * refreshExpiryDays);

    return { accessToken, refreshToken, refreshExpiresAt, expiresIn: accessExpiresIn };
  }

  private sha256(value: string) {
    return createHash("sha256").update(value).digest("hex");
  }
}
