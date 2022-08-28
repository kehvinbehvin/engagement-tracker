import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm"

@Entity({name: "user"})
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar", { nullable: true, length: 200 })
    firstName: string

    @Column("varchar", { nullable: true, length: 200 })
    lastName: string

    @Column("varchar", { nullable: true, length: 200 })
    email: string

    @Column("varchar", { nullable: true, length: 200 })
    password: string

    @Column("boolean", { nullable: true, default: false })
    deleted: boolean

}
