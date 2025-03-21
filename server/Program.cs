using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Server.Data;
using Server.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ✅ Add Controllers
builder.Services.AddControllers();

// ✅ Add Database Context
builder.Services.AddDbContext<UserDBContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));

// ✅ Register Auth Service
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<AssignmentService>();
builder.Services.AddScoped<SubmissionService>();

// ✅ Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "default-secret-key")) // Null check
        };
    });

builder.Services.AddAuthorization();

// ✅ Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Replace with your frontend URL
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

// ✅ Apply Migrations & Seed Data
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<UserDBContext>();
}

// ✅ Middleware Configuration
app.UseRouting();

// ✅ Use CORS before Authentication
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

// string email = "panchalom787@gmail.com";
// string password = "Ompan@78";
// string filePath = "test.pdf";
// string targetFolder = "MyFolder"; // Optional, set to null for root

// string fileId = await MegaUploader.UploadPdfToMegaAsync(email, password, filePath, targetFolder);
// if (fileId != null)
// {
//     Console.WriteLine($"File uploaded successfully! File ID: {fileId}");
// }
// else
// {
//     Console.WriteLine("Upload failed.");
// }

// var date = new DateTime();
// string fileId2 = "QGtV1A5B"; // Replace with the file ID from the upload
// string destinationPath = $"C:/Downloads/assignment.pdf"; // Local path to save the file

// bool success = await MegaUploader.DownloadFileFromMegaAsync(email, password, fileId2, destinationPath);
// if (success)
// {
//     Console.WriteLine("Download completed successfully.");
// }
// else
// {
//     Console.WriteLine("Download failed.");
// }
