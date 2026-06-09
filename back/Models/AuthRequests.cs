namespace back.Models;

public record RegisterRequest(
    string Nombre,
    string Apellido,
    int Edad,
    string? NumeroCel,
    string? Correo,
    double Rating,
    string Password
);

public record LoginRequest(
    string Correo,
    string Password
);
