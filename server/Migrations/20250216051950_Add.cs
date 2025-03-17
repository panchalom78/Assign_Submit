using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class Add : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Users_AdminId",
                table: "Assignments");

            migrationBuilder.RenameColumn(
                name: "AdminId",
                table: "Assignments",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Assignments_AdminId",
                table: "Assignments",
                newName: "IX_Assignments_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Users_UserId",
                table: "Assignments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Users_UserId",
                table: "Assignments");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Assignments",
                newName: "AdminId");

            migrationBuilder.RenameIndex(
                name: "IX_Assignments_UserId",
                table: "Assignments",
                newName: "IX_Assignments_AdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Users_AdminId",
                table: "Assignments",
                column: "AdminId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
