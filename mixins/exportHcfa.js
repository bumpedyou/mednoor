export default {
    data: () => ({
        line1: [
            {
                name: 'MEDICARE',
                checkValue: '(Medicare #)',
            },
            {
                name: 'MEDICAID',
                checkValue: '(Medicaid #)',
            },
            {
                name: 'TRICARE CHAMPUS',
                checkValue: "(Sonsor's SSN)",
            },
            {
                name: 'CHAMPVA',
                checkValue: '(Member ID#)',
            },
            {
                name: 'GROUP HEALTH PLAN',
                checkValue: '(SSN or ID)',
            },
            {
                name: 'FECA BLK LUNG',
                checkValue: '(SSN)',
            },
            {
                name: 'OTHER',
                checkValue: '(ID)',
            },
        ],
        line6: [
            {
                checkValue: 'Self',
            },
            {
                checkValue: 'Spouse',
            },
            {
                checkValue: 'Child',
            },
            {
                checkValue: 'Other',
            },
        ],
        line8: {
            first: [
                { checkValue: 'Single' },
                { checkValue: 'Married' },
                { checkValue: 'Other' },
            ],
            second: [
                { checkValue: 'Employed' },
                { checkValue: 'Full-Time Student' },
                { checkValue: 'Part-Time Student' },
            ],
        },
        line10: [
            {
                value: 'a. EMPLOYMENT? (Current or Previous)',
            },
            {
                value: 'b. AUTO ACCIDENT?',
            },
            {
                value: 'c. OTHER ACCIDENT?',
            },
        ],
        line28: [
            { name: 'TOTAL CHARGE' },
            { name: 'AMOUNT PAID' },
            { name: 'BALANCE DUE' },
        ],
        number1: [0, 0, 0, 0, 0, 0, 0, ''],
        number2: { patientName: '' },
        number3: { mm: '', dd: '', yy: '', sex: { male: 0, female: 0 } },
        number4: { insuredName: '' },
        number5: {
            patientAddress: '',
            patientCity: '',
            patientState: '',
            patientZipcode: '',
            patientTelephone: '',
        },
        number6: [0, 0, 0, 0],
        number7: {
            insuredAddress: '',
            insuredCity: '',
            insuredState: '',
            insuredZipcode: '',
            insuredTelephone: '',
        },
        number8: [0, 0, 0, 0, 0, 0],
        number9: {
            value: '',
            a: '',
            b: {
                mm: '',
                dd: '',
                yy: '',
                sex: {
                    male: 0,
                    female: 0,
                },
            },
            c: '',
            d: '',
        },
        number10: {
            value: '',
            a: {
                yes: 0,
                no: 0,
            },
            b: {
                yes: 0,
                no: 0,
                place: '',
            },
            c: {
                yes: 0,
                no: 0,
            },
            d: '',
        },
        number11: {
            value: '',
            a: {
                mm: '',
                dd: '',
                yy: '',
                sex: {
                    male: 0,
                    female: 0,
                },
            },
            b: '',
            c: '',
            d: {
                yes: 0,
                no: 0,
            },
        },
        number12: {
            signed: '',
            date: '',
        },
        number13: {
            value: '',
        },
        number14: {
            mm: '',
            dd: '',
            yy: '',
            sex: {
                male: 0,
                female: 0,
            },
        },
        number15: {
            mm: '',
            dd: '',
            yy: '',
            sex: {
                male: 0,
                female: 0,
            },
        },
        number16: {
            from: {
                mm: '',
                dd: '',
                yy: '',
                sex: {
                    male: 0,
                    female: 0,
                },
            },
            to: {
                mm: '',
                dd: '',
                yy: '',
                sex: {
                    male: 0,
                    female: 0,
                },
            },
        },
        number17: {
            value: '',
            a: {
                first: '',
                second: '',
            },
            b: '',
        },
        number18: {
            from: {
                mm: '',
                dd: '',
                yy: '',
                sex: {
                    male: 0,
                    female: 0,
                },
            },
            to: {
                mm: '',
                dd: '',
                yy: '',
                sex: {
                    male: 0,
                    female: 0,
                },
            },
        },
        number19: {
            value: '',
        },
        number20: {
            yes: 0,
            no: 0,
            charges: {
                first: '',
                second: '',
            },
        },
        number21: {
            first: [0, 0],
            second: [0, 0],
        },
        number22: {
            code: '',
            no: '',
        },
        number23: {
            value: '',
        },
        number24: {
            a: {
                from: { mm: '', dd: '', yy: '' },
                to: { mm: '', dd: '', yy: '' },
            },
            b: '',
            c: '',
            d: { cpt: '', modifier: '' },
            e: '',
            f: '',
            g: '',
            h: '',
            i: '',
            j: '',
        },
        number25: {
            value: '',
            ssn: 0,
            ein: 0,
        },
        number26: {
            value: '',
        },
        number27: {
            yes: 0,
            no: 0,
        },
        number28: {
            value: '',
        },
        number29: {
            value: '',
        },
        number30: {
            value: '',
        },
        number31: {
            value: '',
        },
        number32: {
            value: '',
            a: '',
            b: '',
        },
        number33: {
            value: '',
            a: '',
            b: '',
        },

        strArray: [
            [
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ],
            [
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ],
            [
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ],
            [
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ],
            [
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ],
            [
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ],
        ],
    }),
    methods: {



        exportHcfa(item) {
            console.log(item.hcfa, item.claims_info, item.insured_info)

            if (item) {
                if (item.hcfa && item.hcfa.hcfa_info) {
                    const info = item.hcfa.hcfa_info
                    this.number1 = info.number1
                    this.number8 = info.number8
                    this.number9 = info.number9
                    this.number10 = info.number10
                    this.number11 = info.number11
                    this.number14 = info.number14
                    this.number15 = info.number15
                    this.number16 = info.number16
                    this.number18 = info.number18
                    this.number19 = info.number19
                    this.number20 = info.number20
                    this.number21 = info.number21
                    this.number22 = info.number22
                    this.number23 = info.number23
                    this.number24 = info.number24
                    this.number27 = info.number27
                    this.number28 = info.number28
                    this.number29 = info.number29
                    this.number30 = info.number30
                    this.number11 = info.number11
                    this.strArray = info.strArray
                }

                if (item && item.claims_info) {
                    const claimsInfo = item.claims_info
                    this.number25.value = claimsInfo.number25.value
                    if (claimsInfo.number25.selectedValue === 'ein') {
                        this.number25.ssn = 0
                        this.number25.ein = 1
                    } else {
                        this.number25.ssn = 1
                        this.number25.ein = 0
                    }
                    this.number26 = claimsInfo.number26
                    this.number31 = claimsInfo.number31
                    this.number32 = claimsInfo.number32
                    this.number33 = claimsInfo.number33
                }

                if (item && item.insured_info) {
                    const insuredInfo = item.insured_info
                    this.number4 = insuredInfo.number4
                    this.number5 = insuredInfo.number5
                    for (let i = 0; i < 4; i++) {
                        if (this.line6[i].checkValue === insuredInfo.number6) {
                            this.number6[i] = 1
                        } else {
                            this.number6[i] = 0
                        }
                    }
                    this.number7 = insuredInfo.number7
                    this.number11.a.mm = insuredInfo.number11.a.mm
                    this.number11.a.dd = insuredInfo.number11.a.dd
                    this.number11.a.yy = insuredInfo.number11.a.yy
                    if (insuredInfo.number11.a.sex === 'female') {
                        this.number11.a.sex.female = 1
                        this.number11.a.sex.male = 0
                    } else {
                        this.number11.a.sex.female = 0
                        this.number11.a.sex.male = 1
                    }
                    this.number11.c = insuredInfo.number11.c

                    this.number12 = insuredInfo.number12
                    this.number13 = insuredInfo.number13
                    this.number17 = insuredInfo.number17
                }
                // const doctorInfo = res.data.doctor;
                const patientInfo = item.patient
                this.number2.patientName =
                    patientInfo.user_last_name + ' ' + patientInfo.user_first_name
                const dateArray = patientInfo?.user_date_of_birth?.split('-')
                this.number3.mm = dateArray[0]
                this.number3.dd = dateArray[1]
                this.number3.yy = dateArray[2]?.split('T')[0]



                const data = this.makeXml()
                if (data)
                    this.download(
                        data,
                        new Date().getTime() + '.xml',
                        'application/octet-stream'
                    )
            }

            // export xml

        },

        download(strData, strFileName, strMimeType) {
            const D = document
            const A = arguments
            const a = D.createElement('a')
            const n = A[1]

            // build download link:
            a.href = 'data:' + strMimeType + 'charset=utf-8,' + escape(strData)

            if ('download' in a) {
                // FF20, CH19
                a.setAttribute('download', n)
                a.innerHTML = 'downloading...'
                D.body.appendChild(a)
                setTimeout(function () {
                    const e = D.createEvent('MouseEvents')
                    e.initMouseEvent(
                        'click',
                        true,
                        false,
                        window,
                        0,
                        0,
                        0,
                        0,
                        0,
                        false,
                        false,
                        false,
                        false,
                        0,
                        null
                    )
                    a.dispatchEvent(e)
                    D.body.removeChild(a)
                }, 66)
                return true
            } /* end if('download' in a) */

            // do iframe dataURL download: (older W3)
            const f = D.createElement('iframe')
            D.body.appendChild(f)
            f.src =
                'data:' +
                (A[2] ? A[2] : 'application/octet-stream') +
                (window.btoa ? ';base64' : '') +
                ',' +
                (window.btoa ? window.btoa : escape)(strData)
            setTimeout(function () {
                D.body.removeChild(f)
            }, 333)
            return true
        },
        makeXml() {
            let xmlbody =
                '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE base>\n<base>\n\t'

            // Line 1
            xmlbody =
                xmlbody +
                '<number1>\n\t\t<medicare>' +
                this.number1[0] +
                '</medicare>\n\t\t<medicaid>' +
                this.number1[1] +
                '</medicaid>\n\t\t<sensor>' +
                this.number1[2] +
                '</sensor>\n\t\t<memeberid>' +
                this.number1[3] +
                '</memeberid>\n\t\t<ssnid>' +
                this.number1[4] +
                '</ssnid>\n\t\t<ssn>' +
                this.number1[5] +
                '</ssn>\n\t\t<id>' +
                this.number1[6] +
                '</id>\n\t\t<number1a>' +
                this.number1[this.number1.length - 1] +
                '</number1a>\n\t</number1>\n\t'
            // Line 2
            xmlbody =
                xmlbody + '<number2>' + this.number2.patientName + '</number2>\n\t'
            xmlbody =
                xmlbody +
                '<number3>\n\t\t<month>' +
                this.number3.mm +
                '</month>\n\t\t<day>' +
                this.number3.dd +
                '</day>\n\t\t<year>' +
                this.number3.yy +
                '</year>\n\t\t<sex>\n\t\t<male>' +
                this.number3.sex.male +
                '</male>\n\t\t\t<female>' +
                this.number3.sex.female +
                '</female>\n\t\t</sex>\n\t</number3>\n\t'
            xmlbody =
                xmlbody + '<number4>' + this.number4.insuredName + '</number4>\n\t'
            // Line 3
            xmlbody =
                xmlbody +
                '<number5>\n\t\t<patientaddress>' +
                this.number5.patientAddress +
                '</patientaddress>\n\t\t<patientcity>' +
                this.number5.patientCity +
                '</patientcity>\n\t\t<patientstate>' +
                this.number5.patientCity +
                '</patientstate>\n\t\t<patientzipcode>' +
                this.number5.patientZipcode +
                '</patientzipcode>\n\t\t<patienttelephone>' +
                this.number5.patientTelephone +
                '</patienttelephone>\n\t</number5>\n\t'
            xmlbody =
                xmlbody +
                '<number6>\n\t\t<self>' +
                this.number6[0] +
                '</self>\n\t\t<supose>' +
                this.number6[1] +
                '</supose>\n\t\t<child>' +
                this.number6[2] +
                '</child>\n\t\t<other>' +
                this.number6[3] +
                '</other>\n\t</number6>\n\t'
            xmlbody =
                xmlbody +
                '<number7>\n\t\t<insuredaddress>' +
                this.number5.insuredAddress +
                '</insuredaddress>\n\t\t<insuredcity>' +
                this.number5.insuredCity +
                '</insuredcity>\n\t\t<insuredstate>' +
                this.number5.insuredState +
                '</insuredstate>\n\t\t<insuredzipcode>' +
                this.number5.insuredZipcode +
                '</insuredzipcode>\n\t\t<insuredtelephone>' +
                this.number5.insuredTelephone +
                '</insuredtelephone>\n\t</number7>\n\t'
            // Line 4
            xmlbody =
                xmlbody +
                '<number8>\n\t\t<single>' +
                this.number8[0] +
                '</single>\n\t\t<married>' +
                this.number8[1] +
                '</married>\n\t\t<other>' +
                this.number8[2] +
                '</other>\n\t\t<employed>' +
                this.number8[3] +
                '</employed>\n\t\t<fulltimestudent>' +
                this.number8[4] +
                '</fulltimestudent>\n\t\t<parttimestudent>' +
                this.number8[5] +
                '</parttimestudent>\n\t</number8>\n\t'
            // Line 5
            xmlbody =
                xmlbody +
                '<number9>\n\t\t<value>' +
                this.number9.value +
                '</value>\n\t\t<a>' +
                this.number9.a +
                '</a>\n\t\t<b>\n\t\t\t<month>' +
                this.number9.b.mm +
                '</month>\n\t\t\t<day>' +
                this.number9.b.dd +
                '</day>\n\t\t\t<year>' +
                this.number9.b.yy +
                '</year>\n\t\t\t<sex>\n\t\t\t\t<male>' +
                this.number9.b.sex.male +
                '</male>\n\t\t\t\t<female>' +
                this.number9.b.sex.female +
                '</female>\n\t\t\t</sex>\n\t\t</b>\n\t\t<c>' +
                this.number9.c +
                '</c>\n\t\t<d>' +
                this.number9.d +
                '</d>\n\t</number9>\n'
            // Line 6
            xmlbody =
                xmlbody +
                '\t<number10>\n\t\t<value>' +
                this.number10.value +
                '</value>\n\t\t<a>\n\t\t\t<yes>' +
                this.number10.a.yes +
                '</yes>\n\t\t\t<no>' +
                this.number10.a.no +
                '</no>\n\t\t</a>\n\t\t<b>\n\t\t\t<yes>' +
                this.number10.b.yes +
                '</yes>\n\t\t\t<no>' +
                this.number10.b.no +
                '</no>\n\t\t\t<place>' +
                this.number10.b.place +
                '</place>\n\t\t</b>\n\t\t<c>\n\t\t\t<yes>' +
                this.number10.c.yes +
                '</yes>\n\t\t\t<no>' +
                this.number10.c.no +
                '</no>\n\t\t</c>\n\t</number10>\n\t'
            // Line 7
            xmlbody =
                xmlbody +
                '<number11>\n\t\t<value>' +
                this.number11.value +
                '</value>\n\t\t<a>\n\t\t\t<month>' +
                this.number11.a.mm +
                '</month>\n\t\t\t<day>' +
                this.number11.a.dd +
                '</day>\n\t\t\t<year>' +
                this.number11.a.yy +
                '</year>\n\t\t\t<sex>\n\t\t\t\t<male>' +
                this.number11.a.sex.male +
                '</male>\n\t\t\t\t<female>' +
                this.number11.a.sex.female +
                '</female>\n\t\t\t</sex>\n\t\t</a>\n\t\t<b>' +
                this.number11.b +
                '</b>\n\t\t<c>' +
                this.number11.c +
                '</c>\n\t\t<d>\n\t\t\t<yes>' +
                this.number11.d.yes +
                '</yes>\n\t\t\t<no>' +
                this.number11.d.yes +
                '</no>\n\t\t</d>\n\t</number11>\n\t'
            // Line 8
            xmlbody =
                xmlbody +
                '<number12>\n\t\t<signed>' +
                this.number12.signed +
                '</signed>\n\t\t<date>' +
                this.number12.date +
                '</date>\n\t</number12>\n\t'
            // Line 9
            xmlbody = xmlbody + '<number13>' + this.number13.value + '</number13>\n\t'

            // Line 10
            xmlbody =
                xmlbody +
                '<number14>\n\t\t<month>' +
                this.number14.mm +
                '</month>\n\t\t<day>' +
                this.number14.dd +
                '</day>\n\t\t<year>' +
                this.number14.yy +
                '</year>\n\t\t<sex>\n\t\t\t<male>' +
                this.number14.sex.male +
                '</female>\n\t\t</sex>\n\t</number14>\n\t'

            // Line 11
            xmlbody =
                xmlbody +
                '<number15>\n\t\t<month>' +
                this.number15.mm +
                '</month>\n\t\t<day>' +
                this.number15.dd +
                '</day>\n\t\t<year>' +
                this.number15.yy +
                '</year>\n\t</number15>\n\t'

            // Line 12
            xmlbody =
                xmlbody +
                '<number16>\n\t\t<from>\n\t\t\t<month>' +
                this.number16.from.mm +
                '</month>\n\t\t\t<day>' +
                this.number16.from.dd +
                '</day>\n\t\t\t<year>' +
                this.number16.from.yy +
                '</year>\n\t\t</from>\n\t\t<to>\n\t\t\t<month>' +
                this.number16.to.mm +
                '</month>\n\t\t\t<day>' +
                this.number16.to.dd +
                '</day>\n\t\t\t<year>' +
                this.number16.to.yy +
                '</year>\n\t\t</to>\n\t</number16>\n\t'

            // Line 13
            xmlbody =
                xmlbody +
                '<number17>\n\t\t<value>' +
                this.number17.value +
                '</value>\n\t\t<a>\n\t\t\t<first>' +
                this.number17.value +
                '</first>\n\t\t\t<second>' +
                this.number17.a.first +
                '</second>\n\t\t</a>\n\t\t<b>' +
                this.number17.b +
                '</b>\n\t</number17>\n\t'

            // Line 14
            xmlbody =
                xmlbody +
                '<number18>\n\t\t<from>\n\t\t\t<month>' +
                this.number18.from.mm +
                '</month>\n\t\t\t<day>' +
                this.number18.from.dd +
                '</day>\n\t\t\t<year>' +
                this.number18.from.yy +
                '</year>\n\t\t</from>\n\t\t<to>\n\t\t\t<month>' +
                this.number18.to.mm +
                '</month>\n\t\t\t<day>' +
                this.number18.to.dd +
                '</day>\n\t\t\t<year>' +
                this.number18.to.yy +
                '</year>\n\t\t</to>\n\t</number18>\n\t'

            // Line 15
            xmlbody = xmlbody + '<number19>' + this.number19.value + '</number19>\n\t'

            // Line 16
            xmlbody =
                xmlbody +
                '<number20>\n\t\t<yes>' +
                this.number20.yes +
                '</yes>\n\t\t<no>' +
                this.number20.no +
                '</no>\n\t\t<charges>\n\t\t\t<first>' +
                this.number20.charges.first +
                '</first>\n\t\t\t<seconde>' +
                this.number20.charges.second +
                '</seconde>\n\t\t</charges>\n\t</number20>\n\t'

            // Line 17
            xmlbody =
                xmlbody +
                '<number21>\n\t\t<first>' +
                this.number21.first[0] +
                '</first>\n\t\t<second>' +
                this.number21.first[1] +
                '</second>\n\t\t<third>' +
                this.number21.second[0] +
                '</third>\n\t\t<fourth>' +
                this.number21.second[1] +
                '</fourth>\n\t</number21>\n\t'

            // Line 18
            xmlbody =
                xmlbody +
                '<number22>\n\t\t<code>' +
                this.number22.code +
                '</code>\n\t\t<no>' +
                this.number22.no +
                '</no>\n\t</number22>\n\t'

            // Line 19
            xmlbody = xmlbody + '<number23>' + this.number23.value + '</number23>\n\t'

            // Line 20
            xmlbody =
                xmlbody +
                '<number24>\n\t\t<from>\n\t\t\t<month>' +
                this.number24.a.from.mm +
                '</month>\n\t\t\t<day>' +
                this.number24.a.from.dd +
                '</day>\n\t\t\t<year>' +
                this.number24.a.from.yy +
                '</year>\n\t\t</from>\n\t\t<to>\n\t\t\t<month>' +
                this.number24.a.to.mm +
                '</month>\n\t\t\t<day>' +
                this.number24.a.to.dd +
                '</day>\n\t\t\t<year>' +
                this.number24.a.to.yy +
                '</year>\n\t\t</to>\n\t</number24>\n\t'

            // Line 22
            xmlbody =
                xmlbody +
                '<number25>\n\t\t<value>' +
                this.number25.value +
                '</value>\n\t\t<ssn>' +
                this.number25.ssn +
                '</ssn>\n\t\t<ein>' +
                this.number25.ein +
                '</ein>\n\t</number25>\n\t'

            // Line 23
            xmlbody = xmlbody + '<number26>' + this.number26.value + '</number26>\n\t'

            // Line 24
            xmlbody =
                xmlbody +
                '<number27>\n\t\t<yes>' +
                this.number27.yes +
                '</yes>\n\t\t<no>' +
                this.number12.no +
                '</no>\n\t</number27>\n\t'

            // Line 25
            xmlbody = xmlbody + '<number28>' + this.number28.value + '</number28>\n\t'

            // Line 26
            xmlbody = xmlbody + '<number29>' + this.number29.value + '</number29>\n\t'

            // Line 27
            xmlbody = xmlbody + '<number30>' + this.number30.value + '</number30>\n\t'

            // Line 28
            xmlbody = xmlbody + '<number31>' + this.number31.value + '</number31>\n\t'

            // Line 29
            xmlbody =
                xmlbody +
                '<number32>\n\t\t<value>' +
                this.number32.value +
                '</value>\n\t\t<a>' +
                this.number32.a +
                '</a>\n\t\t<b>' +
                this.number32.b +
                '</b>\n\t</number32>\n\t'

            // Line 30
            xmlbody =
                xmlbody +
                '<number33>\n\t\t<value>' +
                this.number33.value +
                '</value>\n\t\t<a>' +
                this.number33.a +
                '</a>\n\t\t<b>' +
                this.number33.b +
                '</b>\n\t</number33>\n\t'

            xmlbody += '</base>\n'
            return xmlbody
        },
    },
}