import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
export declare class SlotsController {
    private readonly slotsService;
    constructor(slotsService: SlotsService);
    create(createSlotDto: CreateSlotDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSlotDto: UpdateSlotDto): string;
    remove(id: string): string;
}
