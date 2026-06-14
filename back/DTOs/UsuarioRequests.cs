namespace back.DTOs;

public record CreateUsuarioRequest(
    string Nombre,
    string Apellido,
    int Edad,
    string? NumeroCel,
    string? Correo,
    double Rating,
    string? Password
);

public record UpdateUsuarioRequest(
    string Nombre,
    string Apellido,
    int Edad,
    string? NumeroCel,
    string? Correo,
    double Rating,
    string? Password
);
