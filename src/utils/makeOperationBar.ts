import { IRobotModule } from "neutron-core";
import { IOperationCategory } from "../components/Connection/components/types";

export function makeOperationBar(
  categories: IOperationCategory[],
  modules: IRobotModule[]
): IOperationCategory[] {
  const operationbar: IOperationCategory[] = categories.reduce<
    IOperationCategory[]
  >((acc, category) => {
    if (category.name === "global") {
        return [...acc, category];
    }
    const categoryModules = category.components.filter((component) =>
      modules.find((module) => module.type === 'component.partType')
    );
    if (categoryModules.length === 0) {
      return acc;
    }
    return [
      ...acc,
      {
        ...category,
        components: categoryModules,
      },
    ];
  }, []);
  return operationbar;
}
