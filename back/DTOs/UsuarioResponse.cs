using back.Models;

namespace back.DTOs;

public record UsuarioResponse(
    int Id,
    string Nombre,
    string Apellido,
    int Edad,
    string? NumeroCel,
    string? Correo,
    double Rating
);

public static class UsuarioDtoExtensions
{
    public static UsuarioResponse ToResponse(this Usuario usuario)
        => new(
            usuario.Id,
            usuario.Nombre,
            usuario.Apellido,
            usuario.Edad,
            usuario.NumeroCel,
            usuario.Correo,
            usuario.Rating
        );

    public static Usuario ToEntity(this CreateUsuarioRequest request)
        => new()
        {
            Nombre = request.Nombre,
            Apellido = request.Apellido,
            Edad = request.Edad,
            NumeroCel = request.NumeroCel,
            Correo = request.Correo,
            Rating = request.Rating
        };

    public static void ApplyUpdates(this Usuario usuario, UpdateUsuarioRequest request)
    {
        usuario.Nombre = request.Nombre;
        usuario.Apellido = request.Apellido;
        usuario.Edad = request.Edad;
        usuario.NumeroCel = request.NumeroCel;
        usuario.Correo = request.Correo;
        usuario.Rating = request.Rating;
    }
}
