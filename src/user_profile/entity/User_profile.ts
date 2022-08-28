import { Entity, PrimaryGeneratedColumn, BaseEntity, OneToOne } from "typeorm"
import {AdminUser} from "../../user/entity/AdminUser"

@Entity({name: "profile"})
export class Profile extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => AdminUser, (user) => user.profile)
    user: AdminUser

}
