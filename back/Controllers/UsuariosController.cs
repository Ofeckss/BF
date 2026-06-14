using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back.Data;
using back.DTOs;
using back.Models;

namespace back.Controllers;

[ApiController]
[Route("[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsuariosController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IEnumerable<UsuarioResponse>> GetAll()
    {
        return await _db.Usuarios
            .Select(u => u.ToResponse())
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UsuarioResponse>> GetById(int id)
    {
        var usuario = await _db.Usuarios.FindAsync(id);
        if (usuario == null)
            return NotFound();

        return usuario.ToResponse();
    }

    [HttpPost]
    public async Task<ActionResult<UsuarioResponse>> Create(CreateUsuarioRequest request)
    {
        var usuario = request.ToEntity();

        if (!string.IsNullOrEmpty(request.Password))
        {
            usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }

        _db.Usuarios.Add(usuario);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, usuario.ToResponse());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateUsuarioRequest request)
    {
        var existing = await _db.Usuarios.FindAsync(id);
        if (existing == null)
            return NotFound();

        existing.ApplyUpdates(request);

        if (!string.IsNullOrEmpty(request.Password))
        {
            existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var usuario = await _db.Usuarios.FindAsync(id);
        if (usuario == null)
            return NotFound();

        _db.Usuarios.Remove(usuario);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
