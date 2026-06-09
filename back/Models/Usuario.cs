using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace back.Models;

[Table("usuarios")]
public class Usuario
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("nombre")]
    public string Nombre { get; set; } = null!;

    [Column("apellido")]
    public string Apellido { get; set; } = null!;

    [Column("edad")]
    public int Edad { get; set; }

    [Column("numero_cel")]
    public string? NumeroCel { get; set; }

    [Column("correo")]
    public string? Correo { get; set; }

    [Column("rating")]
    public double Rating { get; set; }

    [JsonIgnore]
    [Column("password")]
    public string PasswordHash { get; set; } = null!;

    [NotMapped]
    [JsonIgnore]
    public string? Password { get; set; }
}
