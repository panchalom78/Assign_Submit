using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddCollegeModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CollegeId",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CollegeId",
                table: "Faculties",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Colleges",
                columns: table => new
                {
                    CollegeId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CollegeName = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Colleges", x => x.CollegeId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_CollegeId",
                table: "Users",
                column: "CollegeId");

            migrationBuilder.CreateIndex(
                name: "IX_Faculties_CollegeId",
                table: "Faculties",
                column: "CollegeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Faculties_Colleges_CollegeId",
                table: "Faculties",
                column: "CollegeId",
                principalTable: "Colleges",
                principalColumn: "CollegeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Colleges_CollegeId",
                table: "Users",
                column: "CollegeId",
                principalTable: "Colleges",
                principalColumn: "CollegeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Faculties_Colleges_CollegeId",
                table: "Faculties");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Colleges_CollegeId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Colleges");

            migrationBuilder.DropIndex(
                name: "IX_Users_CollegeId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Faculties_CollegeId",
                table: "Faculties");

            migrationBuilder.DropColumn(
                name: "CollegeId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CollegeId",
                table: "Faculties");
        }
    }
}
