package com.example.demo.payload;

import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {
  @NotBlank
  public String username;
  @NotBlank
  public String password;
  public String role; // optional, defaults to USER
}
