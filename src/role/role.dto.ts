export class CreateRoleRequestDto {
  role!: string;
  slug!: string;
  description_key!: string;
  is_active!: boolean;
}

export class UpdateRoleRequestDto extends CreateRoleRequestDto {}
