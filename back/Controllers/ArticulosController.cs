using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back.Data;
using back.DTOs;
using back.Models;

[ApiController]
[Route("articulo")]

public class ArticulosController : ControllerBase
{
    private readonly AppDbContext _db;

    public ArticulosController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? categoriaId,
        [FromQuery] bool? disponible,
        [FromQuery] bool? esTrueque
    )
    {
        var query = _db.Articulos
            .Include(a => a.Categoria)
            .Include(a => a.Fotos)
            .AsQueryable();
        
        if(categoriaId.HasValue)
            query = query.Where(a => a.CategoriaId == categoriaId);
        if(disponible.HasValue)
            query = query.Where(a => a.Disponible == disponible);
        if(esTrueque.HasValue)
            query = query.Where(a => a.EsTrueque == esTrueque);
        
        var articulos = await query
            .OrderByDescending(a => a.FechaPublicacion)
            .Select(a => new
            {
                a.Id,
                a.Nombre,
                a.Descripcion,
                a.Precio,
                a.EsTrueque,
                a.Disponible,
                a.FechaPublicacion,
                Categoria = a.Categoria == null ? null : new { a.CategoriaId, a.Categoria.Nombre},
                Fotos = a.Fotos.OrderBy(f => f.Orden).Select(f => new {f.Id, f.Url, f.Orden})
            })
            .ToListAsync();
        return Ok(articulos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var articulo = await _db.Articulos
            .Include(a => a.Categoria)
            .Include(a => a.Fotos)
            .Where(a => a.Id == id)
            .Select(a => new
            {
                a.Id,
                a.Nombre,
                a.Descripcion,
                a.Precio,
                a.EsTrueque,
                a.Disponible,
                a.FechaPublicacion,
                a.VendedorId,
                Categoria = a.Categoria == null ? null : new { a.CategoriaId, a.Categoria.Nombre},
                Fotos = a.Fotos.OrderBy(f => f.Orden).Select(f => new {f.Id, f.Url, f.Orden})
            })
            .FirstOrDefaultAsync();
        
        if (articulo == null)
            return NotFound(new { error = $"Articulo con id {id} no encontrado"});
        
        return Ok(articulo);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ArticuloDto dto)
    {
        var articulo = new Articulo
        {
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
            VendedorId = dto.VendedorId,
            CategoriaId = dto.CategoriaId,
            Precio = dto.Precio,
            EsTrueque = dto.EsTrueque,
            FechaPublicacion = dto.FechaPublicacion,
            Disponible = true
        };

        _db.Articulos.Add(articulo);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new {id = articulo.Id}, new {articulo.Id});
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ArticuloDto dto)
    {
        var articulo = await _db.Articulos.FindAsync(id);

        if(articulo == null)
            return NotFound(new {error = $"Articulo con id {id} no encontrado"});
        
            articulo.Nombre = dto.Nombre;
            articulo.Descripcion = dto.Descripcion;
            articulo.CategoriaId = dto.CategoriaId;
            articulo.Precio = dto.Precio;
            articulo.EsTrueque = dto.EsTrueque;
            articulo.Disponible = dto.Disponible;
            articulo.FechaPublicacion = dto.FechaPublicacion;

            await _db.SaveChangesAsync();
            return NoContent();
    }

    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var articulo = await _db.Articulos.FindAsync(id);

        if (articulo == null)
            return NotFound(new { error = $"Articulo con id {id} no encontrado" });

        _db.Articulos.Remove(articulo);
        await _db.SaveChangesAsync();
        return NoContent();
    }
    
}