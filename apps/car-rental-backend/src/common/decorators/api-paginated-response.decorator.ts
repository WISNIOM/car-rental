import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageDto } from '../pages/dto/page.dto';

export const ApiPaginatedResponse = <TModel extends Type<unknown>>(
  model: TModel
) => {
  return applyDecorators(
    ApiExtraModels(PageDto, model),
    ApiOkResponse({
      description: 'Successful operation',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    })
  );
};
