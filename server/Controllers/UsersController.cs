using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Helper;
using Server.Models;

namespace Server.Controllers;



[ApiController]
[Route("api/[controller]")]

public class UserController : ControllerBase
{
    private readonly UserDBContext _context;

    public UserController(UserDBContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        user.Password = PassHash.HashPassword(user.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
    }

    [HttpPost("/api/user/login")]
    public async Task<ActionResult<User>> VerifyUser(LoginUser loginUser)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginUser.Email);

        if (user == null)
        {
            return NotFound();
        }

        if (PassHash.VerifyPassword(user.Password, loginUser.Password))
        {
            return user;
        }

        return NoContent();
    }

    [HttpGet]
    public async Task<ActionResult<List<User>>> GetAllUsers()
    {
        return await _context.Users.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUserById(int id)
    {
        var user = await _context.Users
        .FirstOrDefaultAsync(u => u.Id == id);
        if (user == null)
            return NotFound();
        return user;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, User user)
    {

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (id != user.Id)
            return BadRequest();

        user.Password = PassHash.HashPassword(user.Password);

        _context.Entry(user).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
