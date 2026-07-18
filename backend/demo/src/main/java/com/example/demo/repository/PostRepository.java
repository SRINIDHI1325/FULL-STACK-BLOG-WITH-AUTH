package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
  List<Post> findByAuthor(String author);

  List<Post> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String t, String c);
}
