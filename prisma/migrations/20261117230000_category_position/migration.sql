-- Ordem de exibicao das categorias no app
ALTER TABLE "category" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;
