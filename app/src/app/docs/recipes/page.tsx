import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "#/ui/breadcrumb";
import { Badge } from "#/ui/badge";
import { Card } from "#/card";
import { getAllRecipes } from "../../../../scripts/source-files";

export default function RecipesOverviewPage() {
  const recipes = getAllRecipes();

  return (
    <div className="flex flex-col container-main py-8 gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">~</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs/introduction">Docs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Recipes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
          <Badge variant="secondary">Standalone</Badge>
        </div>
        <p className="text-muted-foreground max-w-prose">
          Focused, copy-ready patterns for common TypeScript and React challenges. Each recipe is a self-contained
          guide with working code you can drop straight into your project.
        </p>
      </div>

      {recipes.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Available Recipes</h2>
          <div className="flex flex-col gap-3">
            {recipes.map((recipe) => (
              <Card
                key={recipe.name}
                title={recipe.title}
                href={`/docs/recipes/${recipe.name}`}
                size="default"
                badges={
                  recipe.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : undefined
                }>
                {recipe.description}
              </Card>
            ))}
          </div>
        </div>
      )}

      {recipes.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No recipes found. Add <code>.md</code> files to the <code>recipes/</code> directory at the repo root.
        </p>
      )}
    </div>
  );
}
