import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinColumn } from "typeorm"
import { Activity } from "../../activity/entity/Activity"

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

    @ManyToMany(() => Activity, (activity) => activity.admins)
    activity: Activity[]

    @Column("boolean", { nullable: true, default: false })
    deleted: boolean

}
