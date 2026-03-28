import { NestFactory } from '@nestjs/core';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Import from compiled output in `dist` so Node can run this script directly.
// Make sure to run `npm run build` in backend before executing this script.
// dist output is under dist/src when compiled by Nest
import { AppModule } from '../dist/src/app.module.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function main() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('TodoList Collaboration API')
    .setDescription('API collection')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outPath = path.join(__dirname, '..', 'docs', 'hoppscotch-collection.json');
  writeFileSync(outPath, JSON.stringify(document, null, 2));
  console.log(`OpenAPI JSON exported to ${outPath}`);
  await app.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
