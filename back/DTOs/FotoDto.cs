using System.Text.Json.Serialization;

public class FotoDto
{
    [JsonPropertyName("articulo_id")]
    public int ArticuloId { get; set; }

    [JsonPropertyName("url")]
    public string? Url { get; set; }

    [JsonPropertyName("orden")]
    public int Orden { get; set; }
}
