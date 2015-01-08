/**
 * Created by ikerib on 30/06/14.
 */

produccionApp.controller('bonosController', function ($scope) {

    $scope.bonoak = [
        {  fecha:'19/12/2014', Operario:'Felipe',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0473080-OF238011' },
        {  fecha:'19/12/2014', Operario:'Adolfo',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0473080-OF238011' },
        {  fecha:'19/12/2014', Operario:'Isa',      Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0473080-OF240198' },
        {  fecha:'19/12/2014', Operario:'Haritz',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0473080-OF240198' },
        {  fecha:'19/12/2014', Operario:'Mikel.P.', Turno:'Diurno',     Horas:'8.00', 'Ref':'3ci0372010-OF239414' },
        {  fecha:'19/12/2014', Operario:'Iñigo',    Turno:'Tarde',      Horas:'8.00', 'Ref':'3ci0372010-OF239414' },
        {  fecha:'19/12/2014', Operario:'Ander',    Turno:'Tarde',      Horas:'8.00', 'Ref':'CI-0500-OP003917' },
        {  fecha:'19/12/2014', Operario:'Xabi',     Turno:'Tarde',      Horas:'8.00', 'Ref':'CI-0500-OP003917' },
        {  fecha:'19/12/2014', Operario:'Leo',      Turno:'Tarde',      Horas:'8.00', 'Ref':'3ci0372010-OF239414' },
        {  fecha:'19/12/2014', Operario:'Oier',     Turno:'Noche',      Horas:'8.00', 'Ref':'3ci0372010-OF239414' },
        {  fecha:'19/12/2014', Operario:'Mikel',    Turno:'Noche',      Horas:'3.50', 'Ref':'CI-0520-OF238040' },
        {  fecha:'19/12/2014', Operario:'Luis',     Turno:'Noche',      Horas:'3.50', 'Ref':'CI-0520-OF238040' },

        {  fecha:'19/12/2014', Operario:'Felipe',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0473010-OF238009' },
        {  fecha:'19/12/2014', Operario:'Adolfo',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0473010-OF238009' },
        {  fecha:'19/12/2014', Operario:'Isa',      Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0473010-OF238009' },
        {  fecha:'19/12/2014', Operario:'Haritz',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0473010-OF238009' },
        {  fecha:'19/12/2014', Operario:'Mikel.P.', Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0150000-OF236670' },
        {  fecha:'19/12/2014', Operario:'Iñigo',    Turno:'Tarde',      Horas:'8.00', 'Ref':'3CI0150000-OF236670' },
        {  fecha:'19/12/2014', Operario:'Ander',    Turno:'Tarde',      Horas:'8.00', 'Ref':'CI-0486-OP003855' },
        {  fecha:'19/12/2014', Operario:'Xabi',     Turno:'Tarde',      Horas:'8.00', 'Ref':'CI-0486-OP003855' },
        {  fecha:'19/12/2014', Operario:'Leo',      Turno:'Tarde',      Horas:'8.00', 'Ref':'3CI0473080-OF238011' },
        {  fecha:'19/12/2014', Operario:'Oier',     Turno:'Noche',      Horas:'8.00', 'Ref':'3CI0473080-OF238011' },
        {  fecha:'19/12/2014', Operario:'Mikel',    Turno:'Noche',      Horas:'3.50', 'Ref':'3CI0416000-OF238020' },
        {  fecha:'19/12/2014', Operario:'Luis',     Turno:'Noche',      Horas:'3.50', 'Ref':'CI-0520-OF238040' },

        {  fecha:'19/12/2014', Operario:'Felipe',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CIT473010-OF238007' },
        {  fecha:'19/12/2014', Operario:'Adolfo',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CIT473010-OF238007' },
        {  fecha:'19/12/2014', Operario:'Isa',      Turno:'Diurno',     Horas:'8.00', 'Ref':'3CIT473010-OF238007' },
        {  fecha:'19/12/2014', Operario:'Haritz',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CIT473010-OF238007' },
        {  fecha:'19/12/2014', Operario:'Mikel.P.', Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0469030-OF236625' },
        {  fecha:'19/12/2014', Operario:'Iñigo',    Turno:'Tarde',      Horas:'8.00', 'Ref':'3CI0469030-OF236625' },
        {  fecha:'19/12/2014', Operario:'Ander',    Turno:'Tarde',      Horas:'8.00', 'Ref':'3CI0473010-OF238009' },
        {  fecha:'19/12/2014', Operario:'Xabi',     Turno:'Tarde',      Horas:'8.00', 'Ref':'3CI0473010-OF238009' },
        {  fecha:'19/12/2014', Operario:'Leo',      Turno:'Tarde',      Horas:'8.00', 'Ref':'3CI0473010-OF238009' },
        {  fecha:'19/12/2014', Operario:'Oier',     Turno:'Noche',      Horas:'8.00', 'Ref':'3CI0416000-OF225700' },
        {  fecha:'19/12/2014', Operario:'Mikel',    Turno:'Noche',      Horas:'3.50', 'Ref':'3CI0416000-OF225700' },
        {  fecha:'19/12/2014', Operario:'Luis',     Turno:'Noche',      Horas:'3.50', 'Ref':'3CI0416000-OF225700' },

        {  fecha:'19/12/2014', Operario:'Felipe',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0527000-OF238749' },
        {  fecha:'19/12/2014', Operario:'Adolfo',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0527000-OF238749' },
        {  fecha:'19/12/2014', Operario:'Isa',      Turno:'Diurno',     Horas:'8.00', 'Ref':'CI-0518-OF236622' },
        {  fecha:'19/12/2014', Operario:'Haritz',   Turno:'Diurno',     Horas:'8.00', 'Ref':'CI-0518-OF236622' },
        {  fecha:'19/12/2014', Operario:'Mikel.P.', Turno:'Diurno',     Horas:'8.00', 'Ref':'3CIT473080-OF238010' },
        {  fecha:'19/12/2014', Operario:'Iñigo',    Turno:'Tarde',      Horas:'8.00', 'Ref':'3CIT473080-OF238010' },
        {  fecha:'19/12/2014', Operario:'Ander',    Turno:'Tarde',      Horas:'8.00', 'Ref':'3CIT473080-OF238010' },
        {  fecha:'19/12/2014', Operario:'Xabi',     Turno:'Tarde',      Horas:'8.00', 'Ref':'3CIT473080-OF238010' },
        {  fecha:'19/12/2014', Operario:'Leo',      Turno:'Tarde',      Horas:'8.00', 'Ref':'3CIT473080-OF238010' },
        {  fecha:'19/12/2014', Operario:'Oier',     Turno:'Noche',      Horas:'8.00', 'Ref':'3CI0416000-OF225700' },
        {  fecha:'19/12/2014', Operario:'Mikel',    Turno:'Noche',      Horas:'3.50', 'Ref':'3CI0416000-OF225700' },
        {  fecha:'19/12/2014', Operario:'Luis',     Turno:'Noche',      Horas:'3.50', 'Ref':'3CI0416000-OF225700' },

        {  fecha:'19/12/2014', Operario:'Felipe',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0528000-OF237139' },
        {  fecha:'19/12/2014', Operario:'Adolfo',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0528000-OF237139' },
        {  fecha:'19/12/2014', Operario:'Isa',      Turno:'Diurno',     Horas:'8.00', 'Ref':'3CIT528000-OF237138' },
        {  fecha:'19/12/2014', Operario:'Haritz',   Turno:'Diurno',     Horas:'8.00', 'Ref':'3CIT528000-OF237138' },
        {  fecha:'19/12/2014', Operario:'Mikel.P.', Turno:'Diurno',     Horas:'8.00', 'Ref':'3CI0528000-OF237139' },
        {  fecha:'19/12/2014', Operario:'Iñigo',    Turno:'Tarde',      Horas:'8.00', 'Ref':'3CI0528000-OF237139' },
        {  fecha:'19/12/2014', Operario:'Ander',    Turno:'Tarde',      Horas:'8.00', 'Ref':'3CI0527000-OF238749' },
        {  fecha:'19/12/2014', Operario:'Xabi',     Turno:'Tarde',      Horas:'8.00', 'Ref':'3CI0527000-OF238749' },
        {  fecha:'19/12/2014', Operario:'Leo',      Turno:'Tarde',      Horas:'8.00', 'Ref':'3CI0527000-OF238749' },
        {  fecha:'19/12/2014', Operario:'Oier',     Turno:'Noche',      Horas:'8.00', 'Ref':'3CI0416000-OF238020' },
        {  fecha:'19/12/2014', Operario:'Mikel',    Turno:'Noche',      Horas:'3.50', 'Ref':'3CI0416000-OF238020' },
        {  fecha:'19/12/2014', Operario:'Luis',     Turno:'Noche',      Horas:'3.50', 'Ref':'3CI0416000-OF238020' },
    ];

});