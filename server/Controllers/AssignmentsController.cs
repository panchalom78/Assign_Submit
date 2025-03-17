
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Controllers;
[ApiController]
[Route("api/[controller]")]

public class AssignmentsController : ControllerBase
{

    private readonly UserDBContext _context;

    public AssignmentsController(UserDBContext context)
    {
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Assignment>> GetAssignmet(int id)
    {
        var Assignment = await _context.Assignments.FindAsync(id);

        if (Assignment == null)
            return NotFound();
        return Assignment;
    }

    [HttpPost]
    public async Task<ActionResult<Assignment>> CreateAssignment(Assignment assignment)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _context.Assignments.Add(assignment);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAssignmet), new { id = assignment.Id }, assignment);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAssignment(int id, Assignment assignment)
    {
        if (id != assignment.Id)
            return BadRequest();
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        _context.Entry(assignment).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("user/{id}")]
    public async Task<ActionResult<List<Assignment>>> GetAssignmentsByUser(int id)
    {
        var assignments = await _context.Assignments.Where(a => a.UserId == id).ToListAsync();
        if (assignments == null)
            return NotFound();
        return assignments;
    }

}