-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
