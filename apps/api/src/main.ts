import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swagger = new DocumentBuilder()
    .setTitle("Locum Finder API")
    .setDescription("Healthcare staffing marketplace API")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup("docs", app, doc);

  const port = configService.get<number>("PORT", 4000);
  await app.listen(port);
}

void bootstrap();
