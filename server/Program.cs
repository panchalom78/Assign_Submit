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
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<ChatService>();

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
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "default-secret-key")),
            ClockSkew = TimeSpan.Zero // Enforce strict expiration
        };

        // Extract token from the HttpOnly cookie named "jwt"
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Cookies["jwt"];
                if (!string.IsNullOrEmpty(token))
                {
                    context.Token = token;
                }
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                // Log the reason for token validation failure
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                // Log successful token validation (for debugging)
                Console.WriteLine("Token validated successfully.");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// ✅ Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://localhost:5000",
                "http://localhost:80"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(origin => true); // Allow any origin in development
    });
});

// ✅ Add Logging (Optional but recommended for debugging)
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
    logging.SetMinimumLevel(LogLevel.Information);
});

var app = builder.Build();

// ✅ Apply Migrations & Seed Data
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<UserDBContext>();
    try
    {
        // Apply any pending migrations
        dbContext.Database.Migrate();
        Console.WriteLine("Database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error applying migrations: {ex.Message}");
    }
}

// ✅ Middleware Configuration
app.UseRouting();

// ✅ Use CORS before Authentication
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// ✅ Add Exception Handling Middleware (Optional but recommended)
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"error\": \"An unexpected error occurred.\"}");
    });
});

app.MapControllers();

app.Run();
