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
              meta: {
                type: 'object',
                properties: {
                  itemCount: { type: 'number', example: 1 },
                  pageCount: { type: 'number', example: 1 },
                  page: { type: 'number', example: 1 },
                  take: { type: 'number', example: 1 },
                  hasPreviousPage: { type: 'boolean', example: false },
                  hasNextPage: { type: 'boolean', example: false},
                },
              },
              data: {
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
