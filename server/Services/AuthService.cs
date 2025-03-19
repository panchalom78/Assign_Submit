using Microsoft.EntityFrameworkCore; // Add for FirstOrDefaultAsync
using Microsoft.IdentityModel.Tokens;
using Server.Data;
using Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace Server.Services
{
    public class AuthService
    {
        private readonly UserDBContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(UserDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<User> Register(string fullName, string email, string password, string role)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email); // Use async
            if (existingUser != null)
            {
                throw new Exception("Email already exists");
            }

            var user = new User
            {
                FullName = fullName,
                Email = email,
                Password = BCrypt.Net.BCrypt.HashPassword(password),
                Role = role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<string> Login(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email); // Use async
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                throw new Exception("Invalid credentials");
            }
            return GenerateJwtToken(user);
        }

        private string GenerateJwtToken(User user)
        {
          var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new Exception("JWT Key is missing")));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256); // Define creds here

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? "unknown"), // Default if null
                new Claim(ClaimTypes.Role, user.Role ?? "unknown")   // Default if null
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds // Use creds here
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}