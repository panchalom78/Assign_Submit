using Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Server.Data{
    public class UserDBContext : DbContext{
        protected readonly IConfiguration Configuration;

        public UserDBContext(IConfiguration configuration){
            Configuration = configuration;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Database=Assignment;Username=postgres;Password=Ompan@78");
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
    }
}