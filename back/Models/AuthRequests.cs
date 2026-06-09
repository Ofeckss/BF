namespace back.Models;

public record RegisterRequest(
    string Nombre,
    string Correo,
    string Password
);

public record LoginRequest(
    string Correo,
    string Password
);
