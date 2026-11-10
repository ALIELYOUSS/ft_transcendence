import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
export declare class SlotsService {
    create(createSlotDto: CreateSlotDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSlotDto: UpdateSlotDto): string;
    remove(id: number): string;
}
