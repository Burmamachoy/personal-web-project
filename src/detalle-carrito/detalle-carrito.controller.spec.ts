import { Test, TestingModule } from '@nestjs/testing';
import { DetalleCarritoController } from './detalle-carrito.controller';

describe('DetalleCarrito Controller', () => {
  let controller: DetalleCarritoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetalleCarritoController],
    }).compile();

    controller = module.get<DetalleCarritoController>(DetalleCarritoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
