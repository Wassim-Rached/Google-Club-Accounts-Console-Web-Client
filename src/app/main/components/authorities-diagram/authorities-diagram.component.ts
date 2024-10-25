import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import mermaid from 'mermaid';

export interface Authorities {
  email: string;
  roles: AuthorityRole[];
  permissions: AuthorityPermission[];
}

interface AuthorityRole {
  name: string;
  scope: string;
  permissions: AuthorityPermission[];
}

interface AuthorityPermission {
  name: string;
  scope: string;
}

@Component({
  selector: 'app-authorities-diagram',
  standalone: true,
  templateUrl: './authorities-diagram.component.html',
  styleUrls: ['./authorities-diagram.component.scss']
})
export class AuthoritiesDiagramComponent implements AfterViewInit {
  @Input({ required: true }) authorities!: Authorities;
  @ViewChild('diagram', { static: true }) diagramView!: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
    this.renderDiagram();
  }

  renderDiagram() {
    const diagram = this.generateMermaidDiagram(this.authorities);
    this.diagramView.nativeElement.innerHTML = diagram;

    // Initialize mermaid with basic configuration
    mermaid.initialize({ startOnLoad: false });
    mermaid.init(undefined, this.diagramView.nativeElement);
  }

  generateMermaidDiagram(authorities: Authorities): string {
    const email = authorities.email;
    let diagram = 'graph TD\n  user["' + email + '"]\n';

    const scopeGroups: { [key: string]: string[] } = {}; // Group roles/permissions by scope

    authorities.roles.forEach((role, roleIdx) => {
      const roleNode = `role${roleIdx}`;
      const roleLabel = `${role.scope}.role.${role.name}`;

      // Add node to the scope group
      if (!scopeGroups[role.scope]) scopeGroups[role.scope] = [];
      scopeGroups[role.scope].push(roleNode);

      diagram += `  user --> ${roleNode}["${roleLabel}"]\n`;
      diagram += `  style ${roleNode} fill:#FFD700,stroke:#333,stroke-width:2px;\n`; // Yellow for roles

      role.permissions.forEach((permission, permIdx) => {
        const permissionNode = `role${roleIdx}_perm${permIdx}`;
        const permLabel = `${permission.scope}.perm.${permission.name}`;

        // Add permission node to the group
        if (!scopeGroups[permission.scope]) scopeGroups[permission.scope] = [];
        scopeGroups[permission.scope].push(permissionNode);

        diagram += `  ${roleNode} --> ${permissionNode}["${permLabel}"]\n`;
        diagram += `  style ${permissionNode} fill:#ADD8E6,stroke:#333,stroke-width:2px;\n`; // Light blue for permissions
      });
    });

    authorities.permissions.forEach((permission, permIdx) => {
      const permissionNode = `user_perm${permIdx}`;
      const permLabel = `${permission.scope}.perm.${permission.name}`;

      // Add permission node to the group
      if (!scopeGroups[permission.scope]) scopeGroups[permission.scope] = [];
      scopeGroups[permission.scope].push(permissionNode);

      diagram += `  user --> ${permissionNode}["${permLabel}"]\n`;
      diagram += `  style ${permissionNode} fill:#ADD8E6,stroke:#333,stroke-width:2px;\n`;
    });

    // Create scope-based subgraphs
    Object.keys(scopeGroups).forEach((scope) => {
      diagram += `  subgraph ${scope} [${scope}]\n`;
      scopeGroups[scope].forEach((node) => {
        diagram += `    ${node}\n`;
      });
      diagram += `  end\n`;
    });

    console.log(diagram);
    return diagram;
  }
}
