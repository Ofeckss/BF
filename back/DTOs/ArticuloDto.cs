public class ArticuloDto
{
    public string Nombre              { get; set; } = string.Empty;
    public string? Descripcion        { get; set; }
    public int VendedorId             { get; set; }
    public int CategoriaId            { get; set; }
    public decimal Precio             { get; set; }
    public bool EsTrueque             { get; set; }
    public bool Disponible            { get; set; } = true;
    public DateOnly? FechaPublicacion { get; set; }
}