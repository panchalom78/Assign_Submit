using Server.Data;
using Server.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Server.DTOs;
namespace Server.Services
{
    public class AssignmentService
    {
        private readonly UserDBContext _context;
        private readonly IConfiguration _configuration;

        public AssignmentService(UserDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<object> GetAssignmentById(int id)
        {
            try
            {
                // var handler = new JwtSecurityTokenHandler();
                // var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
                // var userId = jsonToken?.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
                var assignment = await _context.Assignments
            .Include(a => a.User)
            .Include(a => a.Class)
                .ThenInclude(c => c.Course)
            .Where(a => a.AssignmentId == id)
            .Select(a => new
            {
                AssignmentId = a.AssignmentId,
                Title = a.Title,
                Description = a.Description,
                DueDate = a.DueDate,
                SubmittedOn = a.SubmittedOn,
                UserId = a.UserId,
                User = new
                {
                    UserId = a.User.UserId,
                    FullName = a.User.FullName
                },
                Class = new
                {
                    ClassId = a.Class.ClassId,
                    ClassName = a.Class.ClassName,
                    Course = new
                    {
                        CourseId = a.Class.Course.CourseId,
                        CourseName = a.Class.Course.CourseName
                    }
                }
            })
            .FirstOrDefaultAsync();
                if (assignment == null)
                {
                    throw new Exception("Assignment not found");
                }
                return assignment;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to get assignment: " + ex.Message);
            }
        }

        public async Task<Assignment> CreateAssignment(CreateAssignmentRequest assignmentRequest, int id)
        {

            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    throw new Exception("User not found");
                }

                var newAssignment = new Assignment
                {
                    Title = assignmentRequest.Title,
                    Description = assignmentRequest.Description,
                    DueDate = assignmentRequest.DueDate,
                    SubmittedOn = assignmentRequest.SubmittedOn,
                    UserId = user.UserId,
                    ClassId = assignmentRequest.ClassId
                };
                _context.Assignments.Add(newAssignment);
                await _context.SaveChangesAsync();

                var chatGroup = new ChatGroup
                {
                    AssignmentId = newAssignment.AssignmentId,
                    ExpiryDate = assignmentRequest.DueDate, // Using string date directly
                    Messages = new List<ChatMessage>()
                };
                _context.ChatGroups.Add(chatGroup);
                await _context.SaveChangesAsync();

                // Add initial system message
                var systemMessage = new ChatMessage
                {
                    ChatGroupId = chatGroup.ChatGroupId,
                    UserId = user.UserId,
                    Message = $"Chat group created for assignment: {newAssignment.Title}. This chat will be available until the assignment deadline.",
                    SentAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")
                };
                _context.ChatMessages.Add(systemMessage);
                await _context.SaveChangesAsync();


                return newAssignment;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to create assignment: " + ex.Message);
            }
        }

        public async Task<List<Assignment>> GetAllAssignmentsByStudentId(int id)
        {
            try
            {
                var student = await _context.Users.FindAsync(id) ?? throw new Exception("User not found");
                var assignments = await _context.Assignments.Where(a => a.ClassId == student.ClassId).ToListAsync();
                return assignments;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to get assignments: " + ex.Message);
            }
        }

        public async Task<List<object>> GetAllAssignmentsByTeacherId(int id)
        {
            try
            {
                var teacher = await _context.Users.FindAsync(id) ?? throw new Exception("User not found");
                var assignments = await _context.Assignments
                    .Include(a => a.Class)
                        .ThenInclude(c => c.Course)
                    .Include(a => a.User)
                    .Where(a => a.UserId == teacher.UserId)
                    .Select(a => new
                    {
                        AssignmentId = a.AssignmentId,
                        Title = a.Title,
                        Description = a.Description,
                        DueDate = a.DueDate,
                        SubmittedOn = a.SubmittedOn,
                        UserId = a.UserId,
                        User = new { FullName = a.User.FullName },
                        ClassId = a.ClassId,
                        Class = new
                        {
                            ClassId = a.Class.ClassId,
                            ClassName = a.Class.ClassName,
                            Course = new
                            {
                                CourseId = a.Class.Course.CourseId,
                                CourseName = a.Class.Course.CourseName
                            }
                        }
                    })
                    .ToListAsync();

                return assignments.Cast<object>().ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to get assignments: " + ex.Message);
            }
        }
        public async Task<List<Submission>> GetSubmissionsByAssignmentId(int assignmentId)
        {
            try
            {
                var submissions = await _context.Submissions.Where(s => s.AssignmentId == assignmentId).ToListAsync();
                return submissions;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to get submissions: " + ex.Message);
            }
        }

        public class CourseDTO
        {
            public int CourseId { get; set; }
            public string? CourseName { get; set; }
        }

        public async Task<List<CourseDTO>> GetCoursesByTeacherId(int teacherId)
        {
            try
            {
                var teacher = await _context.Users
                    .Include(u => u.Faculty)
                    .ThenInclude(f => f.Courses)
                    .FirstOrDefaultAsync(u => u.UserId == teacherId)
                    ?? throw new Exception("Teacher not found");

                if (teacher.Faculty?.Courses == null)
                {
                    throw new Exception("No courses found for this teacher");
                }

                return teacher.Faculty.Courses
                    .Select(c => new CourseDTO
                    {
                        CourseId = c.CourseId,
                        CourseName = c.CourseName
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to get courses: " + ex.Message);
            }
        }

        public async Task<List<Class>> GetClassesByCourseId(int courseId)
        {
            try
            {
                var classes = await _context.Classes
                    .Where(c => c.CourseId == courseId)
                    .ToListAsync();

                if (!classes.Any())
                {
                    throw new Exception("No classes found for this course");
                }

                return classes;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to get classes: " + ex.Message);
            }
        }


    }
}
