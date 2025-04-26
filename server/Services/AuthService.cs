using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.Data;
using Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Server.DTOs;

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

        public async Task<dynamic> UpdateUserAffiliation(int userId, SelectAffiliationRequest request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            var college = await _context.Colleges.FindAsync(request.CollegeId);
            if (college == null)
            {
                throw new Exception("College not found");
            }

            var faculty = await _context.Faculties.FirstOrDefaultAsync(f => f.FacultyId == request.FacultyId && f.CollegeId == request.CollegeId);
            if (faculty == null)
            {
                throw new Exception("Faculty not found or doesn't belong to the selected college");
            }

            if (request.Role == "student")
            {
                if (request.CourseId == null || request.ClassId == null)
                {
                    throw new Exception("Students must select a Course and a Class.");
                }

                if (request.Prn != null && request.Prn.Length != 10)
                {
                    throw new Exception("PRN must be exactly 10 digits");
                }

                var existingStudent = await _context.Users.FirstOrDefaultAsync(u => u.Prn == request.Prn && u.UserId != userId);
                if (existingStudent != null)
                {
                    throw new Exception("Student with this PRN already exists");
                }

                var course = await _context.Courses.FirstOrDefaultAsync(c => c.CourseId == request.CourseId && c.FacultyId == request.FacultyId);
                if (course == null)
                {
                    throw new Exception("Course not found or doesn't belong to the selected faculty");
                }

                var classEntity = await _context.Classes.FirstOrDefaultAsync(c => c.ClassId == request.ClassId && c.CourseId == request.CourseId);
                if (classEntity == null)
                {
                    throw new Exception("Class not found or doesn't belong to the selected course");
                }

                user.CollegeId = request.CollegeId;
                user.FacultyId = request.FacultyId;
                user.CourseId = request.CourseId.Value;
                user.ClassId = request.ClassId.Value;
                user.Prn = request.Prn;
            }
            else if (request.Role == "teacher")
            {
                user.CollegeId = request.CollegeId;
                user.FacultyId = request.FacultyId;
                user.CourseId = null;
                user.ClassId = null;
                user.Prn = null;
            }
            else
            {
                throw new Exception("Invalid role. Role must be either 'student' or 'teacher'.");
            }

            await _context.SaveChangesAsync();
            return new { Message = "Affiliation updated successfully", user };
        }

        public async Task<dynamic> Register(string fullName, string email, string password, string role)
        {
            if (string.IsNullOrWhiteSpace(fullName) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(role))
            {
                throw new Exception("All fields are required");
            }

            if (!email.Contains('@'))
            {
                throw new Exception("Invalid email format");
            }

            if (role.ToLower() != "student" && role.ToLower() != "teacher")
            {
                throw new Exception("Role must be either 'student' or 'teacher'");
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (existingUser != null)
            {
                throw new Exception("Email already exists");
            }

            var user = new User
            {
                FullName = fullName,
                Email = email,
                Password = BCrypt.Net.BCrypt.HashPassword(password),
                Role = role.ToLower()
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var token = GenerateJwtToken(user);
            return new { Message = "User registered successfully", user, Token = token };
        }

        public async Task<dynamic> Login(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                throw new Exception("Email and password are required");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                throw new Exception("Invalid credentials");
            }

            var token = GenerateJwtToken(user);
            return new { Message = "Login successful", user, Token = token };
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? "user"),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new Exception("JWT Key not configured")));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? throw new Exception("JWT Issuer not configured"),
                audience: _configuration["Jwt:Audience"] ?? throw new Exception("JWT Audience not configured"),
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<List<User>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task SeedData()
        {
            Console.WriteLine("🌱 Seeding data started...");

            try
            {
                // Clear all tables before inserting new data
                await _context.Users.ExecuteDeleteAsync();
                await _context.Classes.ExecuteDeleteAsync();
                await _context.Courses.ExecuteDeleteAsync();
                await _context.Faculties.ExecuteDeleteAsync();
                await _context.Colleges.ExecuteDeleteAsync();
                await _context.SaveChangesAsync();

                Console.WriteLine("✅ All tables cleared. Now inserting fresh data...");

                // Insert Colleges
                var college1 = new College { CollegeName = "MSU" };
                var college2 = new College { CollegeName = "IIT Delhi" };
                var college3 = new College { CollegeName = "IIT Bombay" };

                _context.Colleges.AddRange(college1, college2, college3);
                await _context.SaveChangesAsync();
                Console.WriteLine("✅ Colleges seeded.");

                // Insert Faculties
                var faculty1 = new Faculty { FacultyName = "Engineering", CollegeId = college1.CollegeId };
                var faculty2 = new Faculty { FacultyName = "Science", CollegeId = college1.CollegeId };
                var faculty3 = new Faculty { FacultyName = "Management", CollegeId = college2.CollegeId };

                _context.Faculties.AddRange(faculty1, faculty2, faculty3);
                await _context.SaveChangesAsync();
                Console.WriteLine("✅ Faculties seeded.");

                // Insert Courses
                var course1 = new Course { CourseName = "Computer Science", FacultyId = faculty1.FacultyId };
                var course2 = new Course { CourseName = "Mechanical Engineering", FacultyId = faculty1.FacultyId };
                var course3 = new Course { CourseName = "Physics", FacultyId = faculty2.FacultyId };
                var course4 = new Course { CourseName = "Business Management", FacultyId = faculty3.FacultyId };

                _context.Courses.AddRange(course1, course2, course3, course4);
                await _context.SaveChangesAsync();
                Console.WriteLine("✅ Courses seeded.");

                // Insert Classes
                var class1 = new Class { ClassName = "CS101", CourseId = course1.CourseId, FacultyId = faculty1.FacultyId };
                var class2 = new Class { ClassName = "CS102", CourseId = course1.CourseId, FacultyId = faculty1.FacultyId };
                var class3 = new Class { ClassName = "ME101", CourseId = course2.CourseId, FacultyId = faculty1.FacultyId };
                var class4 = new Class { ClassName = "PHY101", CourseId = course3.CourseId, FacultyId = faculty2.FacultyId };
                var class5 = new Class { ClassName = "BIZ101", CourseId = course4.CourseId, FacultyId = faculty3.FacultyId };

                _context.Classes.AddRange(class1, class2, class3, class4, class5);
                await _context.SaveChangesAsync();
                Console.WriteLine("✅ Classes seeded.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error occurred: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"🔍 Inner Exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }




        public async Task DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task<List<College>> GetColleges()
        {
            return await _context.Colleges.ToListAsync();
        }

        public async Task<List<Faculty>> GetFaculties(int collegeId)
        {
            return await _context.Faculties.Where(f => f.CollegeId == collegeId).ToListAsync();
        }

        public async Task<List<Course>> GetCourses(int facultyId)
        {
            return await _context.Courses.Where(c => c.FacultyId == facultyId).ToListAsync();
        }

        public async Task<List<Class>> GetClasses(int courseId)
        {
            return await _context.Classes.Where(c => c.CourseId == courseId).ToListAsync();
        }

        public async Task<dynamic> VerifyToken(string token)
        {
            var deCodedToken = new JwtSecurityTokenHandler().ReadJwtToken(token);
            var userId = deCodedToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var user = await _context.Users.FindAsync(int.Parse(userId));
            return new { Message = "Token verified successfully", user };
        }
       
        public async Task<dynamic> Profile(string jwt)
        {
            var deCodedToken = new JwtSecurityTokenHandler().ReadJwtToken(jwt);
            var userId = deCodedToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            
            var user = await _context.Users.FindAsync(int.Parse(userId));
            return new { Message = "Profile fetched successfully", user };
        }
        public async Task<dynamic> CollegeName(int collegeId)
        {
            var college = await _context.Colleges.FindAsync(collegeId);
            if (college == null)
            {
                throw new Exception("College not found");
            }
            var collegeName = college.CollegeName;
            return new { Message = "College name fetched successfully", collegeName };
        }
        public async Task<dynamic> FacultyName(int facultyId)
        {
            var faculty = await _context.Faculties.FindAsync(facultyId);
            if (faculty == null)
            {
                throw new Exception("Faculty not found");
            }
            var facultyName = faculty.FacultyName;
            return new { Message = "Faculty name fetched successfully", facultyName };
        }
        public async Task<dynamic> CourseName(int courseId)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
            {
                throw new Exception("Course not found");
            }
            var courseName = course.CourseName;
            return new { Message = "Course name fetched successfully", courseName };
        }
        public async Task<dynamic> ClassName(int classId)
        {
            var classEntity = await _context.Classes.FindAsync(classId);                
            if (classEntity == null)
            {
                throw new Exception("Class not found"); 
            }
            var className = classEntity.ClassName;
            return new { Message = "Class name fetched successfully", className };
        }   
       public async Task<dynamic> UpdateProfile(string jwt, UpdateProfileRequest request)
{
    var deCodedToken = new JwtSecurityTokenHandler().ReadJwtToken(jwt);
    var userId = deCodedToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
    var user = await _context.Users.FindAsync(int.Parse(userId));
    var college = await _context.Colleges.FindAsync(request.CollegeId);
    var faculty = await _context.Faculties.FindAsync(request.FacultyId);
    var course = await _context.Courses.FindAsync(request.CourseId);
    var classEntity = await _context.Classes.FindAsync(request.ClassId);

    if (user == null)
    {
        throw new Exception("User not found");
    }

    user.FullName = request.FullName;
    user.Email = request.Email;

    if (!string.IsNullOrWhiteSpace(request.Password))
    {
        user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
    }

    user.CollegeId = request.CollegeId;
    user.FacultyId = request.FacultyId;
    user.CourseId = request.CourseId;
    user.ClassId = request.ClassId;
    user.Prn = request.Prn;

    await _context.SaveChangesAsync();

    return new
    {
        Message = "Profile updated successfully",
        user.FullName,
        user.Email,
        user.CollegeId,
        user.FacultyId,
        user.CourseId,
        user.ClassId,
        user.Prn
    };
}

  
       

    }
}

