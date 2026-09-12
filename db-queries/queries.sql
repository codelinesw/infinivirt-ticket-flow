--------- Consulta que permite obtener la cantidad de Tickets por estado para cada cliente ---------------------


SELECT 
    c.id AS client_id,
    c.name AS client_name,
    t.status,
    COUNT(t.id) AS total_tickets
FROM clients c
LEFT JOIN tickets t ON c.id = t.client_id
GROUP BY c.id, c.name, t.status
ORDER BY c.name, t.status;


----------- Consulta que permite obtener los cinco clientes con mayor cantidad de tickets de prioridad alta o crítica ------------------------


SELECT 
    c.id AS client_id,
    c.name AS client_name,
    COUNT(t.id) AS total_high_critical_tickets
FROM clients c
INNER JOIN tickets t ON c.id = t.client_id
WHERE t.priority IN ('HIGH', 'CRITICAL')
GROUP BY c.id, c.name
ORDER BY total_high_critical_tickets DESC
LIMIT 5;

----------- Consulta que permite obtener los Tickets sin actualización hace más de 48 horas y que no están cerrados ------------------------

SELECT 
    t.id,
    t.title,
    t.status,
    t.priority,
    t.last_activity_at,
    t.updated_at
FROM tickets t
WHERE t.status != 'CLOSED'
  AND t.last_activity_at < NOW() - INTERVAL 48 HOUR
ORDER BY t.last_activity_at ASC;


----------- Consulta que permite obtener los Usuario con mayor cantidad de tickets resueltos en el último mes ------------------------

SELECT 
    u.id AS user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS agent_name,
    COUNT(t.id) AS resolved_tickets_count
FROM users u
INNER JOIN tickets t ON u.id = t.assigned_to
WHERE t.status IN ('RESOLVED', 'CLOSED')
  AND t.resolved_at >= NOW() - INTERVAL 1 MONTH
GROUP BY u.id, agent_name
ORDER BY resolved_tickets_count DESC
LIMIT 1;


----------- Consulta que permite obtener el Tiempo promedio de resolución de tickets por prioridad (en horas) --------------------

SELECT 
    priority,
    ROUND(AVG(TIMESTAMPDIFF(SECOND, created_at, resolved_at)) / 3600, 2) AS avg_resolution_hours
FROM tickets
WHERE resolved_at IS NOT NULL
GROUP BY priority
ORDER BY avg_resolution_hours ASC;



----------- Consulta que permite obtener la cantidad de tickets abiertos por agente) --------------------

SELECT 
    u.id AS agent_id,
    CONCAT(u.first_name, ' ', u.last_name) AS agent_name,
    COUNT(t.id) AS open_tickets_count
FROM users u
LEFT JOIN tickets t ON u.id = t.assigned_to AND t.status IN ('OPEN', 'IN_PROGRESS', 'PENDING')
GROUP BY u.id, agent_name
ORDER BY open_tickets_count DESC;


----------- Consulta que permite obtener los Tickets que han sido reasignados más de dos veces --------------------


SELECT 
    t.id AS ticket_id,
    t.title,
    COUNT(ta.id) AS reassignments_count
FROM tickets t
INNER JOIN ticket_assignments ta ON t.id = ta.ticket_id
GROUP BY t.id, t.title
HAVING COUNT(ta.id) > 2
ORDER BY reassignments_count DESC;


--------- Consulta que permite obtener el porcentaje de tickets cerrados frente al total creados en los últimos 30 días  --------------------

SELECT 
    COUNT(*) AS total_created,
    SUM(CASE WHEN status = 'CLOSED' THEN 1 ELSE 0 END) AS total_closed,
    ROUND(
        (SUM(CASE WHEN status = 'CLOSED' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0)) * 100, 
        2
    ) AS closed_percentage
FROM tickets
WHERE created_at >= NOW() - INTERVAL 30 DAY;
