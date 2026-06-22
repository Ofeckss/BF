using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back.Data;
using back.DTOs;
using back.Models;

using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

[ApiController]
[Route("fotos")]

public class FotosController : ControllerBase
{
    private readonly Cloudinary _cloudinary;
    private readonly AppDbContext _db;

    public FotosController(Cloudinary cloudinary, AppDbContext db)
    {
        _db = db;
        _cloudinary = cloudinary;
    }

    [HttpPost("upload/{articuloId}")]
    public async Task<IActionResult> Upload(IFormFile file, int articuloId)
    {
        var articulo = await _db.Articulos.FindAsync(articuloId);

        var extensionesPermitidas = new[] {".jpg", ".jpeg", ".png", ".webp"};
        var extension = Path.GetExtension(file.FileName).ToLower();
        if(!extensionesPermitidas.Contains(extension))
            return BadRequest(new {error = "Tipo de archivo no permitido"});

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = $"bartify/articulos/{articuloId}",
            Transformation = new Transformation().Quality("auto").FetchFormat("auto")
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        if (uploadResult.Error != null)
            return StatusCode(500, new {error = uploadResult.Error.Message});

        var orden = await _db.Fotos
            .Where(f => f.ArticuloId == articuloId)
            .CountAsync();

        var foto = new Foto
        {
            ArticuloId = articuloId,
            Url = uploadResult.SecureUrl.ToString(),
            Orden = (byte)orden
        };

        _db.Fotos.Add(foto);
        await _db.SaveChangesAsync();

        return Ok(new { id = foto.Id, url = foto.Url, orden = foto.Orden});
    }

    [HttpGet("articulo/{articuloId}")]
    public async Task<IActionResult> GetByArticulo(int articuloId)
    {
        var fotos = await _db.Fotos
            .Where(f => f.ArticuloId == articuloId)
            .OrderBy(f => f.Orden)
            .Select(f => new { id = f.Id, articulo_id = f.ArticuloId, url = f.Url, orden = f.Orden })
            .ToListAsync();

        return Ok(fotos);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] FotoDto dto)
    {
        if (dto == null)
            return BadRequest(new { error = "Request body is required" });

        var orden = await _db.Fotos
            .Where(f => f.ArticuloId == dto.ArticuloId)
            .CountAsync();

        var foto = new Foto
        {
            ArticuloId = dto.ArticuloId,
            Url = dto.Url ?? string.Empty,
            Orden = (byte)dto.Orden
        };

        _db.Fotos.Add(foto);
        await _db.SaveChangesAsync();

        return Ok(new { id = foto.Id, url = foto.Url, orden = foto.Orden });
    }

    /*
    [HttpDelete("{fotoId}")]
    
    public async Task<IActionResult> Delete(int fotoId)
    {
        var foto = await _context.ProductoFotos.FindAsync(fotoId);
        if (foto == null)
            return NotFound(new { error = "Foto no encontrada" });

        var uri       = new Uri(foto.Url);
        var segments  = uri.AbsolutePath.Split('/');
        var uploadIdx = Array.IndexOf(segments, "upload");
        var publicId  = string.Join("/", segments.Skip(uploadIdx + 2));
        publicId      = Path.ChangeExtension(publicId, null);

        var deleteResult = await _cloudinary.DestroyAsync(new DeletionParams(publicId));
        if (deleteResult.Error != null)
            return StatusCode(500, new { error = deleteResult.Error.Message });

        _context.ProductoFotos.Remove(foto);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    */
}