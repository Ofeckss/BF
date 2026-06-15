namespace back.Models;

public class Articulo
{
    public int Id {get; set;}
    public string Nombre {get; set;} = string.Empty;
    public string? Descripcion {get; set;}
    public int VendedorId {get; set;}
    public int CategoriaId {get; set;}
    public decimal? Precio {get; set;}
    public bool EsTrueque {get; set;}
    public DateOnly? FechaPublicacion {get; set;}
    public bool Disponible {get; set;}

    public Categoria? Categoria {get; set;}
    public ICollection<Foto> Fotos    { get; set; } = new List<Foto>();
}