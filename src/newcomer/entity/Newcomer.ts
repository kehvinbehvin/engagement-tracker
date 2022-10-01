import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm"

export enum NewcomerStatus {
    VISITING = "visiting",
    INTEGRATED = "integrated",
    NEW = "new",
    IRREGULAR = "irregular"
}

@Entity({name: "Newcomer"})
export class Newcomer extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar", { nullable: true, length: 200 })
    firstName: string

    @Column("varchar", { nullable: true, length: 200 })
    lastName: string

    @Column("varchar", { nullable: true, length: 200 })
    email: string
    
    @Column("enum", { enum: NewcomerStatus, default: NewcomerStatus.NEW })
    status: string

    @Column("boolean", { nullable: true, default: false })
    deleted: boolean

}
