import { Component, ElementRef, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
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
export class AuthoritiesDiagramComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) authorities!: Authorities;
  @ViewChild('diagram', { static: true }) diagramView!: ElementRef;
  haveBeenRendered = false;

  constructor() {}

  ngAfterViewInit(): void {
    this.renderDiagram();
    this.haveBeenRendered = true;
  }

  ngOnChanges(): void {
    if (this.haveBeenRendered) {
      mermaid.render('diagram', this.generateMermaidDiagram(this.authorities)).then((e) => {
        this.diagramView.nativeElement.innerHTML = e.svg;
      });
    }
  }

  renderDiagram() {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      themeVariables: {
        primaryColor: '#ffcc00',
        primaryTextColor: '#000000',
        primaryBorderColor: '#333333',
        lineColor: '#333333',
        secondaryColor: '#ADD8E6',
        tertiaryColor: '#FFD700',
        tertiaryTextColor: '#000000',
        tertiaryBorderColor: '#333333'
      },
      flowchart: {
        curve: 'basis'
      },
      sequence: {
        actorMargin: 50,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
        mirrorActors: true,
        width: 150,
        height: 65,
        useMaxWidth: true
      },
      gantt: {
        axisFormat: '%m/%d/%Y',
        barHeight: 20,
        barGap: 4,
        topPadding: 50,
        leftPadding: 75,
        rightPadding: 75,
        gridLineStartPadding: 35,
        fontSize: 11,
        numberSectionStyles: 4
      }
    });
    mermaid.render('diagram', this.generateMermaidDiagram(this.authorities)).then((e) => {
      this.diagramView.nativeElement.innerHTML = e.svg;
    });
  }

  manualRender() {}

  generateMermaidDiagram(authorities: Authorities): string {
    const email = authorities.email;
    let diagram = 'graph LR\n  user["' + email + '"]\n';

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

    return diagram;
  }
}
