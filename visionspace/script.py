import os
from graphviz import Digraph

def generate_structure_diagram(root_dir, output_file='project_structure'):
    dot = Digraph(comment='Project Structure', format='png')
    dot.attr(rankdir='TB')

    exclude_dirs = {
        '.vscode',
        'migrations',
        'node_modules',
        '__pycache__',
        '.git',
        'env',
        'venv',
        'public',
    }

    abs_root = os.path.abspath(root_dir)
    base_name = os.path.basename(abs_root)

    def walk_dir(path, parent=None):
        for item in os.listdir(path):
            if item in exclude_dirs:
                continue

            full_path = os.path.join(path, item)
            rel_path = os.path.relpath(full_path, abs_root).replace("\\", "/")

            shape = 'folder' if os.path.isdir(full_path) else 'note'
            dot.node(rel_path, label=item, shape=shape)

            if parent:
                dot.edge(parent, rel_path)

            if os.path.isdir(full_path):
                walk_dir(full_path, rel_path)

    dot.node(base_name, label=base_name, shape='folder')
    walk_dir(abs_root, base_name)

    dot.render(output_file, cleanup=True)
    print(f"Готово: {output_file}.png")

generate_structure_diagram('./visionspace')
