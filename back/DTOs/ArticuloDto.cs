using System.Text.Json.Serialization;

public class ArticuloDto
{
    [JsonPropertyName("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [JsonPropertyName("descripcion")]
    public string? Descripcion { get; set; }

    [JsonPropertyName("vendedor_id")]
    public int VendedorId { get; set; }

    [JsonPropertyName("categoria_id")]
    public int CategoriaId { get; set; }

    [JsonPropertyName("precio")]
    public decimal Precio { get; set; }

    [JsonPropertyName("trueque")]
    public int Trueque { get; set; }

    [JsonPropertyName("disponible")]
    public int Disponible { get; set; } = 1;

    [JsonPropertyName("fecha_publicacion")]
    public string? FechaPublicacion { get; set; }

    [JsonPropertyName("ubicacion")]
    public string? Ubicacion { get; set; }
}