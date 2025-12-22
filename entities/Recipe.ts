import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("text")
    instructions: string;

    @Column("text")
    notes: string;
}
