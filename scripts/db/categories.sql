DROP TABLE IF EXISTS categories;
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)  ENGINE=INNODB;

INSERT INTO categories (name,active)
VALUES
    ('name', true),
    ('Marketing digital', true),
    ('Delivery', true),
    ('Packaging', true),
    ('E-commerce', true),
    ('Diseño web y logo', true),
    ('Alimentación', true),
    ('Programación', true),
    ('Software y programación', true),
    ('Manufactura y decoración', true),
    ('Bodegaje', true),
    ('Building & jobs', true),
    ('Recursos humanos', true),
    ('Capacitación', true),
    ('Contabilidad', true),
    ('Legal', true),
    ('Entretenimiento', true),
    ('Productos y regalos corporativos', true),
    ('Eventos', true),
    ('Artículos de oficina', true),
    ('Servicios de importación y exportación', true),
    ('Imprenta y gráficas', true),
    ('Stocks', true),
    ('Productos envasados (No consumibles)', true),
    ('Bebestibles', true),
    ('Textil y calzado', true),
    ('Ingeniería', true),
    ('Fotografía', true),
    ('Maquinaria y construcción', true),
    ('Salud y belleza', true),
    ('Limpieza y aseo', true),
    ('Cosmética y belleza', true),
    ('Turismo', true),
    ('Agroindustria', true);

