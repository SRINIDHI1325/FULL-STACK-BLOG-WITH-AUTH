package com.example.demo.controller;

import java.security.Principal;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.RequestHeader;
import com.example.demo.security.JwtUtils;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Post;
import com.example.demo.service.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final JwtUtils jwtUtils;

    public PostController(PostService postService, JwtUtils jwtUtils) {
        this.postService = postService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping
    public ResponseEntity<Post> create(@Valid @RequestBody Post post, Authentication auth,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        String username = null;
        if (auth != null && auth.getName() != null)
            username = auth.getName();
        if (username == null && authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7);
            if (jwtUtils.validateJwt(token))
                username = jwtUtils.getUsernameFromJwt(token);
        }
        if (username == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        post.setAuthor(username);
        return ResponseEntity.ok(postService.create(post));
    }

    @GetMapping
    public List<Post> all() {
        return postService.all();
    }

    @GetMapping("/{id}")
    public Post get(@PathVariable Long id) {
        return postService.get(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> update(@PathVariable Long id, @Valid @RequestBody Post post, Authentication auth,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        String username = null;
        if (auth != null && auth.getName() != null)
            username = auth.getName();
        if (username == null && authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7);
            if (jwtUtils.validateJwt(token))
                username = jwtUtils.getUsernameFromJwt(token);
        }
        if (username == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        return ResponseEntity.ok(postService.update(id, post, username));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        String username = null;
        if (auth != null && auth.getName() != null)
            username = auth.getName();
        if (username == null && authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7);
            if (jwtUtils.validateJwt(token))
                username = jwtUtils.getUsernameFromJwt(token);
        }
        if (username == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        postService.delete(id, username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{username}")
    public List<Post> byUser(@PathVariable String username) {
        return postService.byUser(username);
    }

    @GetMapping("/search")
    public List<Post> search(@RequestParam String keyword) {
        return postService.search(keyword);
    }
}
