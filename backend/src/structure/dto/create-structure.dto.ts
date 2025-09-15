export class CreateStructureDto {
  name: string;
  type: 'organization' | 'team' | 'client' | 'episode';
  parentId?: number; 
}
