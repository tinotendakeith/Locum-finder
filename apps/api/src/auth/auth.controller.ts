import { Body, Controller, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../common/decorators/public.decorator";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterLocumDto } from "./dto/register-locum.dto";
import { RegisterClinicDto } from "./dto/register-clinic.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register/locum")
  registerLocum(@Body() dto: RegisterLocumDto) {
    return this.authService.registerLocum(dto);
  }

  @Public()
  @Post("register/clinic")
  registerClinic(@Body() dto: RegisterClinicDto) {
    return this.authService.registerClinic(dto);
  }

  @Public()
  @Post("login")
  login(@Body() dto: LoginDto, @Req() req: { headers: Record<string, string | undefined>; ip?: string }) {
    return this.authService.login(dto, req.headers["user-agent"], req.ip);
  }

  @Public()
  @Post("refresh")
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto);
  }

  @Post("logout")
  logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Public()
  @Post("forgot-password")
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post("reset-password")
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
