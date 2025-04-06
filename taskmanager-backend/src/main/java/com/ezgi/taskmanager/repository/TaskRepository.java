package com.ezgi.taskmanager.repository;

import com.ezgi.taskmanager.model.Task;
import com.ezgi.taskmanager.model.TaskStatus;
import com.ezgi.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByAssignedTo(User user);
    List<Task> findByProjectId(Long projectId);
    List<Task> findByStatusAndAssignedTo(TaskStatus status, User user);
    @Query("SELECT t FROM Task t " +
            "WHERE (:status IS NULL OR t.status = :status) " +
            "AND (:dueDate IS NULL OR t.dueDate = :dueDate)")
    List<Task> findByStatusAndDueDate(
            @Param("status") TaskStatus status,
            @Param("dueDate") LocalDate dueDate
    );

    @Query("SELECT t FROM Task t " +
            "WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Task> findByKeyword(@Param("keyword") String keyword);

    @Query("SELECT t FROM Task t ORDER BY " +
            "CASE " +
            "WHEN t.status = 'PENDING' THEN 1 " +
            "WHEN t.status = 'IN_PROGRESS' THEN 2 " +
            "WHEN t.status = 'COMPLETED' THEN 3 " +
            "ELSE 4 END, " +
            "t.dueDate ASC")
    List<Task> findAllSortedByStatusAndDueDate();

    @Query("SELECT t FROM Task t WHERE t.assignedTo = :user ORDER BY " +
            "CASE " +
            "WHEN t.status = 'PENDING' THEN 1 " +
            "WHEN t.status = 'IN_PROGRESS' THEN 2 " +
            "WHEN t.status = 'COMPLETED' THEN 3 " +
            "ELSE 4 END, " +
            "t.dueDate ASC")
    List<Task> findByAssignedToOrderByStatusAndDueDate(@Param("user") User user);





}
