package com.example.demo.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Post;
import com.example.demo.repository.PostRepository;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post create(Post p) {
        p.setCreatedAt(Instant.now());
        p.setUpdatedAt(Instant.now());
        return postRepository.save(p);
    }

    public List<Post> all() { return postRepository.findAll(); }

    public Post get(Long id) { return postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post not found")); }

    public Post update(Long id, Post updated, String username) {
        Post existing = get(id);
        if (!existing.getAuthor().equals(username)) throw new IllegalStateException("Not authorized");
        existing.setTitle(updated.getTitle());
        existing.setContent(updated.getContent());
        existing.setUpdatedAt(Instant.now());
        return postRepository.save(existing);
    }

    public void delete(Long id, String username) {
        Post existing = get(id);
        if (!existing.getAuthor().equals(username)) throw new IllegalStateException("Not authorized");
        postRepository.delete(existing);
    }

    public List<Post> byUser(String username) { return postRepository.findByAuthor(username); }

    public List<Post> search(String keyword) { return postRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword); }
}
