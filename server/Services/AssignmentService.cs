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

        public async Task<Assignment> GetAssignmentById(int id)
        {
            try
            {
                // var handler = new JwtSecurityTokenHandler();
                // var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
                // var userId = jsonToken?.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
                var assignment = await _context.Assignments.FindAsync(id);
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

        public async Task<List<Assignment>> GetAllAssignmentsByTeacherId(int id)
        {
            try
            {
                var teacher = await _context.Users.FindAsync(id) ?? throw new Exception("User not found");
                var assignments = await _context.Assignments.Where(a => a.UserId == teacher.UserId).ToListAsync();
                return assignments;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to get assignments: " + ex.Message);
            }
        }
    }
}
